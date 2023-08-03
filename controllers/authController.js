const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const {
  BadRequestError,
  UnauthenticatidedError,
  NotFoundError,
} = require("../errors");

const { StatusCodes } = require("http-status-codes");
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || name.length < 3 || name.length > 50) {
    throw new BadRequestError(
      "veuillez entrer un nom valide entre 3  et 50 caracteres"
    );
  }
  const isValidEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );

  if (!email || !isValidEmail) {
    throw new BadRequestError("veuiller fournier une adresse mail valide");
  }

  if (!password || password.length < 6) {
    throw new BadRequestError("veuillez fournir un mot de passe valide");
  }
  //crypte le mot de passe
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //inserz l'utilisateur avec le mot de passe crypte
  const {
    rows: [user],
  } = await db.query(
    `INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING *`,
    [name, email, hashedPassword]
  );

  // generer le token
  const token = jwt.sign(
    { userID: user.user_id, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

// récupère le body de la requête
const login = async (req, res) => {
  const { email, password } = req.body;

  // valider les inputs
  if (!email || !password) {
    throw new BadRequestError("veuiller fournir les informations");
  }

  // récupère l'utlisateur dans la BDD grâce son email
  const {
    rows: [user],
  } = await db.query(`SELECT * FROM users WHERE email = $1 `, [email]);

  // si pas d'user -> jeter erreur
  if (!user) {
    throw new UnauthenticatidedError("Athentification invalide");
  }

  // comparer les mot de passe
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  // Si false -> jeter erreur
  if (!isPasswordCorrect) {
    throw new UnauthenticatidedError("Authentification invalide");
  }

  // génère le token
  const token = jwt.sign(
    { userID: user.user_id, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  // envoyer le token dans la réponse

  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
