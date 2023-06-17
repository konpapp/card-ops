import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

describe("<App />", () => {
  render(<App />);
  const cardholderNameField = screen.getByLabelText("Card holder name:");
  const cardNumberField = screen.getByLabelText("Card number:");
  const ccvCodeField = screen.getByLabelText("CCV code:");
  const expirationDateField = screen.getByLabelText("Expiration date:");
  const cardTypeField = screen.getByText("Card type:");
  const form = screen.getByRole("form");

  it("form fields are in place", () => {
    expect(cardholderNameField).toBeInTheDocument();
    expect(cardNumberField).toBeInTheDocument();
    expect(ccvCodeField).toBeInTheDocument();
    expect(expirationDateField).toBeInTheDocument();
    expect(cardTypeField).toBeInTheDocument();
  });

  it("can input fields", () => {
    fireEvent.change(cardholderNameField, { target: { value: "a name" } });
    fireEvent.change(cardNumberField, { target: { value: 1234567812345678 } });
    fireEvent.change(ccvCodeField, { target: { value: 123 } });
    fireEvent.change(expirationDateField, { target: { value: "2024-05-01" } });

    expect(form).toHaveFormValues({
      cardholderName: "a name",
      cardNumber: "1234567812345678",
      ccvCode: "123",
      expirationDate: "2024-05-01",
      cardType: "debit",
    });
  });

  it("form is submitted when values are correct", async () => {
    render(<App />);
    const cardholderNameField = screen.getByLabelText("Card holder name:");
    const cardNumberField = screen.getByLabelText("Card number:");
    const ccvCodeField = screen.getByLabelText("CCV code:");
    const expirationDateField = screen.getByLabelText("Expiration date:");
    const submitButton = screen.getByRole("button");

    fireEvent.change(cardholderNameField, { target: { value: "a name" } });
    fireEvent.change(cardNumberField, { target: { value: 1234567812345678 } });
    fireEvent.change(ccvCodeField, { target: { value: 123 } });
    fireEvent.change(expirationDateField, { target: { value: "2024-05-01" } });

    fireEvent.click(submitButton);

    const confirmationMessage = screen.getByText("Form submitted successfully");
    expect(confirmationMessage).toBeInTheDocument();
  });

  it("form is not submitted when values are incorrect", async () => {
    render(<App />);
    const cardholderNameField = screen.getByLabelText("Card holder name:");
    const cardNumberField = screen.getByLabelText("Card number:");
    const ccvCodeField = screen.getByLabelText("CCV code:");
    const expirationDateField = screen.getByLabelText("Expiration date:");
    const submitButton = screen.getByRole("button");

    fireEvent.change(cardholderNameField, { target: { value: "sh" } });
    fireEvent.change(cardNumberField, { target: { value: 123456781234567 } });
    fireEvent.change(ccvCodeField, { target: { value: 12 } });
    fireEvent.change(expirationDateField, { target: { value: "2020-05-01" } });

    fireEvent.click(submitButton);

    const confirmationMessage = screen.queryByText(
      "Form submitted successfully"
    );
    expect(confirmationMessage).not.toBeInTheDocument();
  });

  // TODO: Add tests for each validated field
});
