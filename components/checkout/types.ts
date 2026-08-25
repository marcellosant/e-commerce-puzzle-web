export interface CheckoutFormState {
  contact: {
    email: string;
    phone: string;
  };
  address: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  payment: {
    nameOnCard: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
  };
}

export const EMPTY_CHECKOUT_FORM: CheckoutFormState = {
  contact: { email: "", phone: "" },
  address: {
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  },
  payment: { nameOnCard: "", cardNumber: "", expiry: "", cvc: "" },
};
