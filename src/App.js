import React from "react";
import logo from "./logo.svg";
import Select from "react-select";
import "./App.css";

const newDate = new Date().getFullYear();
const capacityOptions = [
  { value: "2.0", label: "2.0" },
  { value: "2.1", label: "2.1" },
  { value: "2.2", label: "2.2" },
  { value: "3.6", label: "3.6" }
];
const stateOptions = [
  { value: "300", label: "tx" },
  { value: "400", label: "la" },
  { value: "500", label: "nc" }
];
const yearOptions = [
  { value: `2011`, label: "2011" },
  { value: `2012`, label: "2012" },
  { value: `2013`, label: "2013" }
];
const typeOptions = [
  { value: `Disel`, label: "Disel" },
  { value: `Oil`, label: "Oil" }
];

const taxOptions = [
  {
    from: 0,
    to: 49.99,
    fee: 1
  },
  {
    from: 50,
    to: 99.99,
    fee: 1
  },
  {
    from: 100,
    to: 199.99,
    fee: 25
  },
  {
    from: 200,
    to: 299.99,
    fee: 50
  },
  {
    from: 300,
    to: 349.99,
    fee: 75
  },
  {
    from: 350,
    to: 399.99,
    fee: 75
  },
  {
    from: 400,
    to: 449.99,
    fee: 110
  },
  {
    from: 450,
    to: 499.99,
    fee: 110
  },
  {
    from: 500,
    to: 549.99,
    fee: 125
  },
  {
    from: 550,
    to: 599.99,
    fee: 130
  },
  {
    from: 600,
    to: 699.99,
    fee: 140
  },
  {
    from: 700,
    to: 799.99,
    fee: 155
  },
  {
    from: 800,
    to: 899.99,
    fee: 170
  },
  {
    from: 900,
    to: 999.99,
    fee: 185
  },
  {
    from: 1000,
    to: 1199.99,
    fee: 200
  },
  {
    from: 1200,
    to: 1299.99,
    fee: 225
  }
];
const salePriceBid = [
  {
    from: 0,
    to: 99.99,
    fee: 0
  },
  {
    from: 100,
    to: 499.99,
    fee: 39
  },
  {
    from: 500,
    to: 999.99,
    fee: 49
  },
  {
    from: 1000,
    to: 1499.99,
    fee: 69
  },
  {
    from: 1500,
    to: 1999.99,
    fee: 79
  },
  {
    from: 2000,
    to: 3999.99,
    fee: 89
  },
  {
    from: 4000,
    to: 5999.99,
    fee: 99
  },
  {
    from: 6000,
    to: 7999.99,
    fee: 119
  },
  {
    from: 8000,
    to: 1000000,
    fee: 129
  }
];

const nonKioskBid = [
  {
    from: 0,
    to: 99.99,
    fee: 0
  },
  {
    from: 100,
    to: 499.99,
    fee: 29
  },
  {
    from: 500,
    to: 999.99,
    fee: 39
  },
  {
    from: 1000,
    to: 1499.99,
    fee: 59
  },
  {
    from: 1500,
    to: 1999.99,
    fee: 69
  },
  {
    from: 2000,
    to: 3999.99,
    fee: 79
  },
  {
    from: 4000,
    to: 5999.99,
    fee: 89
  },
  {
    from: 6000,
    to: 7999.99,
    fee: 99
  },
  {
    from: 8000,
    to: 1000000,
    fee: 119
  }
];
class App extends React.Component {
  state = {
    result: null,
    price: ""
  };
  componentDidMount() {
    fetch("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5")
      .then(response => response.json())
      .then(data => {
        const usd = data.find(money => money.ccy === "USD");
        this.setState({ usd });
      });
  }
  handleChangeCapacity = capacity => {
    this.setState({ capacity });
  };
  handleChangeState = state => {
    this.setState({ state });
  };
  handleChangeYear = year => {
    const newYear = newDate - year.value;
    year = {
      value: newYear,
      label: year.label
    };
    this.setState({ year });
  };
  handleChangeType = type => {
    this.setState({ type });
  };
  handleInputChange = event => {
    let { value } = event.target;
    value = value.replace(/[^0-9]/g, "");
    this.setState({
      price: value
    });
  };
  getRozmutnennya = () => {
    const { capacity, year, type, price } = this.state;
    let cof;
    if (type.value === "Disel" && capacity.value <= "3.5") {
      cof = 75;
    } else if (type.value === "Disel" && capacity.value > "3.5") {
      cof = 150;
    } else if (type.value === "Oil" && capacity.value <= "3") {
      cof = 50;
    } else if (type.value === "Oil" && capacity.value > "3") {
      cof = 100;
    }
    const between = (x, min, max) => {
      return x >= min && x <= max;
    };
    const tax = taxOptions.find(item => {
      if (between(price, item.from, item.to)) {
        return item;
      }
      return false;
    }).fee;
    const nonKiosk = nonKioskBid.find(item => {
      if (between(price, item.from, item.to)) {
        return item;
      }
      return false;
    }).fee;
    const salePrice = salePriceBid.find(item => {
      if (between(price, item.from, item.to)) {
        return item;
      }
      return false;
    }).fee;
    const sumTax = tax + nonKiosk + salePrice;
    const excise = cof * Number(capacity.value) * Number(year.value) * 1.12;
    const mutnaVartist = Number(price) + sumTax + 450;
    const muto = mutnaVartist * 0.1;
    const pdv = (muto + excise + mutnaVartist) * 0.2;
    const rozmutnennya = excise + muto + pdv;
    this.setState({ rozmutnennya });
  };
  getPensiynuiFond = () => {
    const { price, usd } = this.state;
    const mutnaVartist = Number(price) + 300 + 450;
    const convertedMutnaVartist = mutnaVartist * usd.buy;
    let fond;
    if (convertedMutnaVartist <= 319440) {
      fond = 0.03;
    } else if (convertedMutnaVartist <= 561440) {
      fond = 0.04;
    } else {
      fond = 0.05;
    }
    this.setState({
      fond
    });
  };
  render() {
    const {
      capacity,
      rozmutnennya,
      state,
      year,
      type,
      price,
      fond
    } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div className="content">
          <div className="label">Please type Price</div>
          <input
            type="text"
            className="input"
            value={price}
            onChange={this.handleInputChange}
            placeholder="Type..."
          />
          <div className="label">Please select type of Vehicle</div>
          <Select
            value={type}
            onChange={this.handleChangeType}
            options={typeOptions}
            className="select"
          />
          <div className="label">Please select Year</div>
          <Select
            value={year}
            onChange={this.handleChangeYear}
            options={yearOptions}
            className="select"
          />
          <div className="label">Please select Vehicle capacity</div>
          <Select
            value={capacity}
            onChange={this.handleChangeCapacity}
            options={capacityOptions}
            className="select"
          />
          <div className="label">Please select State</div>
          <Select
            value={state}
            onChange={this.handleChangeState}
            options={stateOptions}
            className="select"
          />
        </div>
        <div className="buttonWrapper">
          <div className="buttonBlock">
            <button
              type="text"
              className="button"
              onClick={this.getRozmutnennya}
            >
              Розрахувати розмитнення:
            </button>
            {rozmutnennya}
          </div>
          <div className="buttonBlock">
            <button
              type="text"
              className="button"
              onClick={this.getPensiynuiFond}
            >
              Розрахувати пенсійний фонд:
            </button>
            {fond}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
