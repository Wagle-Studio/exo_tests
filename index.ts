import Express, { Router } from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import crypto from "node:crypto";

const app = Express();
const PORT = 3000;

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(Express.static(path.join(__dirname, "public")));
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());

const router = Router();

// bases en mémoire
const users: { email: string; password: string }[] = [];
const tokens: string[] = [];

// fake token generator
const generateToken = () => crypto.randomBytes(16).toString("hex");

router.get("/", (req, res) => {
  res.json({ test: "hello" });
});

// signup
router.post("/signup", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(409).json({ message: "Utilisateur déjà existant" });
  }

  users.push({ email, password });
  const token = generateToken();
  tokens.push(token);

  res.status(201).json({
    message: "Inscription réussie",
    token,
    user: { email },
  });
});

// signin
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Email ou mot de passe invalide" });
  }

  const token = generateToken();
  tokens.push(token);

  res.json({
    message: "Connexion réussie",
    token,
    user: { email },
  });
});

// me (protégé par token)
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant ou invalide" });
  }

  const token = authHeader.split(" ")[1];
  if (!tokens.includes(token)) {
    return res.status(403).json({ message: "Token non reconnu" });
  }

  // retour bidon
  res.json({
    message: "Token valide",
    data: { answer: 42, foo: "bar" },
  });
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Le serveur a démarré sur le port ${PORT}`);
});
