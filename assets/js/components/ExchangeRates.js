import React, { Component } from 'react';
import { getExchangeRates } from "../services/ExchangeRatesApi";

class ExchangeRates extends Component {
    constructor() {
        super();
        this.state = {
            loading: true, selectedDate: '', currentExchangeRates: [], dateExchangeRates: [], dateError: ""
        };
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleFilterClick = this.handleFilterClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    /**
     * Akcja wywoływana przy zmianie daty w inpucie
     */
    handleDateChange(event) {
        this.setState({
            selectedDate: event.target.value,
        });
    }

    /**
     * Akcja wywoływana przy kliknięciu przycisku filtruj
     * Waliduje informacje w fomularzu i pobiera dane z API
     */
    handleFilterClick() {
        this.setState({ loading: true });
        this.setState({
            dateError: "",
        });

        if (!this.validate(this.state.selectedDate)) {
            this.setState({ loading: false });
            return;
        }

        let date = new Date(this.state.selectedDate);
        if (date.getFullYear() >= 2023) {
            this.fetchExchangeRates(this.state.selectedDate);
            this.props.history.push(`/exchange-rates/${this.state.selectedDate}`);
        }
    }

    /**
     * Sprawdza czy wciśnięto enter, jeżeli tak, to wykonuje walidację i pobiera dane z API
     */
    handleKeyDown(event) {
        if (event.key !== 'Enter') {
            return
        }

        this.handleFilterClick();
    }

    /**
     * Walidacja daty
     */
    validate(dateString) {
        if (!this.isValidDate(dateString)) {
            this.setState({
                dateError: "Invalid date format",
            });

            return false;
        }

        let date = new Date(dateString);
        const curDate = new Date();

        if (date.getFullYear() < 2023) {
            this.setState({
                dateError: "Selected date must be after 2022 year",
            });

            return false;
        }

        if (date > curDate) {
            this.setState({
                dateError: "Selected date must be before current date",
            });

            return false;
        }

        return true;
    }

    /**
     * Waliduje format daty za pomocą REGEX
     */
    isValidDate(dateString) {
        if (!dateString) {
            return false;
        }

        const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        return regex.test(dateString);
    }

    /**
     * Pobiera dane z API przy załadowaniu komponentu
     * Pobiera informacje z dnia dzisiejszego, jeżeli podano datę w URL to pobiera dane z API dla tej daty 
     */
    componentDidMount() {
        this.fetchExchangeRates();

        const { date } = this.props.match.params;
        if (date) {
            this.setState({ selectedDate: date });
            this.fetchExchangeRates(date);
        }
    }

    /**
     * Pobiera dane z API
     */
    async fetchExchangeRates(date = null) {
        if (!date) {
            const response = await getExchangeRates();
            this.setState({ currentExchangeRates: response });
        } else {
            const response = await getExchangeRates(date);
            this.setState({ dateExchangeRates: response });

            if (this.state.dateExchangeRates.length === 0) {
                this.setState({
                    dateError: "No exchange rates available for selected date",
                });
            }
        }

        this.setState({ loading: false });
    }

    render() {
        const loading = this.state.loading;
        return (
            <div>
                <section className="row-section">
                    <div className="container">
                        {loading &&
                            <div className="row">
                                <div className="col-md-12 text-center align-middle">
                                    <div className="spinner-container">
                                        <div className="spinner"></div>
                                    </div>
                                </div>
                            </div>
                        }
                        {!loading &&
                            <div className="row mt-5">
                                <div className="col-md-8 offset-md-2">
                                    <h2 className="text-center"><span>Exchange rates</span></h2>
                                    <div className="card shadow">
                                        <div className="card-header">
                                            <span className="h4 font-weight-bold">Exchange table rates</span>
                                        </div>
                                        <div className="card-body">
                                            <div className="row mb-3">
                                                <div className="col-md-12">
                                                    <div className="form-inline text-center">
                                                        <input
                                                            type="date"
                                                            id="date"
                                                            className="form-control form-control-sm"
                                                            value={this.state.selectedDate}
                                                            onChange={this.handleDateChange}
                                                            onKeyDown={this.handleKeyDown}
                                                        />
                                                        <button className="btn btn-success btn-sm ml-2" onClick={this.handleFilterClick}>Filter</button>
                                                        {this.state.dateError.length > 0 &&
                                                            <small className="text-danger ml-2" id="date-error">{this.state.dateError}</small>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: "40%" }}>Currency</th>
                                                        <th style={{ width: "30%" }}>Current rate</th>
                                                        {
                                                            this.state.dateExchangeRates.length > 0 && <th style={{ width: "30%" }}>Rate on {this.state.selectedDate}</th>
                                                        }
                                                    </tr>
                                                </thead>
                                                <tbody id="currency-table">
                                                    {this.state.currentExchangeRates.map((exchangeRate, index) => (
                                                        <tr key={index}>
                                                            <td className="align-middle"><span className="font-weight-bold">{exchangeRate.symbol}</span> {exchangeRate.code} ({exchangeRate.name})</td>
                                                            <td>
                                                                <p className="text-success m-0"><i className="fa-solid fa-arrow-up"></i> <span className="badge badge-secondary w-25">Buy</span> {exchangeRate.symbol} {exchangeRate.rates.buy ?? "n/d"}</p>
                                                                <p className="text-danger m-0"><i className="fa-solid fa-arrow-down"></i> <span className="badge badge-secondary w-25">Sell</span> {exchangeRate.symbol} {exchangeRate.rates.sell}</p>
                                                            </td>
                                                            {
                                                                this.state.dateExchangeRates.length > 0 && <td>
                                                                    <p className="text-success m-0"><i className="fas fa-home"></i> <span className="badge badge-secondary w-25">Buy</span> {this.state.dateExchangeRates[index].symbol} {this.state.dateExchangeRates[index].rates.buy ?? "n/d"}</p>
                                                                    <p className="text-danger m-0"><i className="fas fa-arrow-down"></i> <span className="badge badge-secondary w-25">Sell</span> {this.state.dateExchangeRates[index].symbol} {this.state.dateExchangeRates[index].rates.sell ?? "n/d"}</p>
                                                                </td>
                                                            }
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </section>
            </div>
        )
    }
}
export default ExchangeRates;
