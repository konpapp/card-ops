import "./App.css";
import { useState } from "react";

enum ERROR {
  CARD_HOLDER_LETTERS = "Card Holder name should only be letters",
  CARD_HOLDER_LENGTH = "Card Holder name should have at least 5 characters",
  CARD_NUMBER_DIGITS = "Card number should contain only digits",
  CARD_NUMBER_LENGTH = "Card number should be 16 digits",
  CCV_CODE_DIGITS = "CCV code should contain only digits",
  CCV_CODE_LENGTH = "CCV code should be 3 digits",
  EXPIRATION_DATE_AFTER_TODAY = "Expiration date should be in the future",
}

function App() {
  const [cardholderName, setCardholderName] = useState("");
  const [cardholderNameError, setCardholderNameError] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");

  const [ccvCode, setCcvCode] = useState("");
  const [ccvCodeError, setCcvCodeError] = useState("");

  const [expirationDate, setExpirationDate] = useState("");
  const [expirationDateError, setExpirationDateError] = useState("");

  const [formResults, setFormResults] = useState("");

  const validateCardholderName = () => {
    if (cardholderName.length <= 4) {
      setCardholderNameError(ERROR.CARD_HOLDER_LENGTH);
      return false;
    } else if (!/^[A-Za-z\s]*$/.test(cardholderName)) {
      setCardholderNameError(ERROR.CARD_HOLDER_LETTERS);
      return false;
    }
    setCardholderNameError("");
    return true;
  };

  const validateCardNumber = () => {
    if (!/^[0-9]+$/.test(cardNumber)) {
      setCardNumberError(ERROR.CARD_NUMBER_DIGITS);
      return false;
    } else if (cardNumber.length !== 16) {
      setCardNumberError(ERROR.CARD_NUMBER_LENGTH);
      return false;
    }
    setCardNumberError("");
    return true;
  };

  const validateCcvCode = () => {
    if (!/^[0-9]+$/.test(ccvCode)) {
      setCcvCodeError(ERROR.CCV_CODE_DIGITS);
      return false;
    } else if (ccvCode.length !== 3) {
      setCcvCodeError(ERROR.CCV_CODE_LENGTH);
      return false;
    }
    setCcvCodeError("");
    return true;
  };

  const validateExpirationDate = () => {
    if (new Date(expirationDate) <= new Date()) {
      setExpirationDateError(ERROR.EXPIRATION_DATE_AFTER_TODAY);
      return false;
    }
    setExpirationDateError("");
    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setFormResults("");

    const isCardholderNameValid = validateCardholderName();
    const isCardNumberValid = validateCardNumber();
    const isCcvCodeValid = validateCcvCode();
    const isExpirationDateValid = validateExpirationDate();

    const isFormValid =
      isCardholderNameValid &&
      isCardNumberValid &&
      isCcvCodeValid &&
      isExpirationDateValid;

    if (!isFormValid) {
      return;
    }

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    setFormResults(JSON.stringify(formJson));
    form.reset();
  };

  return (
    <div className="App">
      <form className="App-header" aria-label="form" onSubmit={handleSubmit}>
        <label className="Input-field">
          Card holder name:
          <input
            name="cardholderName"
            placeholder="Your full name"
            type="text"
            onChange={(e) => setCardholderName(e.target.value)}
            required
          />
          <span className="Error-message">{cardholderNameError}</span>
        </label>
        <label className="Input-field">
          Card number:
          <input
            name="cardNumber"
            placeholder="Your card number"
            type="text"
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
          <span className="Error-message">{cardNumberError}</span>
        </label>
        <label className="Input-field">
          CCV code:
          <input
            name="ccvCode"
            placeholder="CCV"
            type="text"
            onChange={(e) => setCcvCode(e.target.value)}
            required
          />
          <span className="Error-message">{ccvCodeError}</span>
        </label>
        <label className="Input-field">
          Expiration date:
          <input
            name="expirationDate"
            placeholder="Expiration date"
            type="date"
            onChange={(e) => setExpirationDate(e.target.value)}
            required
          />
          <span className="Error-message">{expirationDateError}</span>
        </label>
        <label className="Input-field">
          Card type:
          <label>
            <input type="radio" name="cardType" value="debit" defaultChecked />
            Debit
          </label>
          <label>
            <input type="radio" name="cardType" value="credit" />
            Credit
          </label>
        </label>
        <button type="submit">Submit</button>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ color: "green" }}>
            {formResults && "Form submitted successfully"}
          </p>
          <span>{formResults}</span>
        </div>
      </form>
    </div>
  );
}

export default App;
