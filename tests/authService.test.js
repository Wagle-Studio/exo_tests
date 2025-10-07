import { describe, it, expect } from "vitest";
import { AuthService } from "../src/services/AuthService";
import User from "../src/modeles/User";

// Test de la méthode `generateToken` du AuthService
describe("AuthService.", () => {
  it("retourne une chaîne hexadécimale de 32 caractères", () => {
    const token = AuthService.generateToken();
    expect(typeof token).toBe("string");
  });

  it("génère un token différent à chaque appel", () => {
    const token1 = AuthService.generateToken();
    const token2 = AuthService.generateToken();
    expect(token1).not.toBe(token2);
  });
});

// Test de la méthode `createUser` du AuthService
describe("AuthService.createUser", () => {
  const userEmail = "test@test.com";
  const userPsswd = "123";

  const user = AuthService.createUser(userEmail, userPsswd);

  it("retourne une instance de User", () => {
    expect(user).toBeInstanceOf(User);
  });

  it("renseigne l'email", () => {
    expect(user.getEmail()).toBe("test@test.com");
  });

  it("renseigne le mot de passe", () => {
    expect(user.getPassword()).toBe("123");
  });

  it("renseigne la date d'inscription (jusqu'à la minute près)", () => {
    const now = new Date();
    const expected = now.toISOString().slice(0, 16);
    const actual = user.getSignupAt().slice(0, 16);
    expect(actual).toBe(expected);
  });
});
