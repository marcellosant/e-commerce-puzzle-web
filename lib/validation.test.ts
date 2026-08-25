import { describe, expect, it } from "vitest";
import {
  isAddressValid,
  isContactValid,
  isPaymentValid,
  isValidCardNumber,
  isValidCvc,
  isValidEmail,
  isValidExpiry,
  isValidPhone,
} from "@/lib/validation";

describe("isValidEmail", () => {
  it("accepts a well-formed email", () => {
    expect(isValidEmail("maria@example.com")).toBe(true);
  });

  it("rejects missing @ or domain", () => {
    expect(isValidEmail("maria@")).toBe(false);
    expect(isValidEmail("maria.example.com")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("isValidPhone", () => {
  it("accepts numbers with 8+ digits, ignoring formatting", () => {
    expect(isValidPhone("(11) 98765-4321")).toBe(true);
  });

  it("rejects too-short numbers", () => {
    expect(isValidPhone("1234567")).toBe(false);
  });
});

describe("isValidCardNumber", () => {
  it("accepts 13-19 digit numbers regardless of spacing", () => {
    expect(isValidCardNumber("4242 4242 4242 4242")).toBe(true);
  });

  it("rejects numbers outside the valid length range", () => {
    expect(isValidCardNumber("4242")).toBe(false);
    expect(isValidCardNumber("4".repeat(20))).toBe(false);
  });
});

describe("isValidExpiry", () => {
  it("accepts MM/YY format", () => {
    expect(isValidExpiry("12/28")).toBe(true);
  });

  it("rejects malformed expiry", () => {
    expect(isValidExpiry("2028-12")).toBe(false);
    expect(isValidExpiry("1228")).toBe(false);
  });
});

describe("isValidCvc", () => {
  it("accepts 3 or 4 digit codes", () => {
    expect(isValidCvc("123")).toBe(true);
    expect(isValidCvc("1234")).toBe(true);
  });

  it("rejects other lengths", () => {
    expect(isValidCvc("12")).toBe(false);
    expect(isValidCvc("12345")).toBe(false);
  });
});

describe("step validators", () => {
  it("isContactValid requires both a valid email and phone", () => {
    expect(isContactValid({ email: "a@b.com", phone: "11987654321" })).toBe(true);
    expect(isContactValid({ email: "a@b.com", phone: "" })).toBe(false);
    expect(isContactValid({ email: "", phone: "11987654321" })).toBe(false);
  });

  it("isAddressValid requires every field to be non-empty", () => {
    const complete = {
      firstName: "Maria",
      lastName: "Silva",
      street: "Rua A, 1",
      city: "São Paulo",
      state: "SP",
      zip: "01000-000",
      country: "Brasil",
    };
    expect(isAddressValid(complete)).toBe(true);
    expect(isAddressValid({ ...complete, city: "  " })).toBe(false);
  });

  it("isPaymentValid requires a valid name, card, expiry, and cvc", () => {
    const complete = {
      nameOnCard: "Maria Silva",
      cardNumber: "4242 4242 4242 4242",
      expiry: "12/28",
      cvc: "123",
    };
    expect(isPaymentValid(complete)).toBe(true);
    expect(isPaymentValid({ ...complete, cardNumber: "42" })).toBe(false);
    expect(isPaymentValid({ ...complete, expiry: "invalid" })).toBe(false);
    expect(isPaymentValid({ ...complete, cvc: "12" })).toBe(false);
  });
});
