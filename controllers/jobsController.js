const db = require("../db");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

//CREE UN JOB
const createJob = async (req, res) => {
  const { company, position, status } = req.body;
  const { userID } = req.user;

  if (!company || !position || !status) {
    throw new BadRequestError("veuillez remplir tout les champs du formulaire");
  }

  const {
    rows: [job],
  } = await db.query(
    `INSERT INTO jobs (company, position,status, user_id) VALUES ($1, $2, $3, $4) RETURNING *`,
    [company, position, status, userID]
  );

  res.status(StatusCodes.CREATED).json({ job });
};

//RECUPERE TOUT LES JOBS
const getAllJobs = async (req, res) => {
  const { userID } = req.user;
  const { rows: jobs } = await db.query("SELECT * FROM job WHERE user_id =$1", [
    userID,
  ]);

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

// RECUPERE UN JOB
const getJob = async (req, res) => {
  const { jobId } = req.params;

  if (isNaN(Number(id))) {
    throw new BadRequestError("Identifiant invalide");
  }

  const {
    rows: [job],
  } = await db.query("SELECT * FROM jobs WHERE job_id =$1", [jobId]);

  if (!job) {
    throw new BadRequestError(`Pas de jod avec l'id ${jobId}`);
  }

  res.status(200).json({ job });
};

//MODIFIE UN JOB
const updateJob = async (req, res) => {
  const { jobId } = req.params;
  const { company, position, status } = req.body;

  if (isNaN(Number(id))) {
    throw new BadRequestError("Identifiant invalide");
  }

  if (!company || !position || !status) {
    throw new BadRequestError("veuillez entrez une tache");
  }

  const {
    rows: [updatedJob],
  } = await db.query(
    "UPDATE jobs SET  company=$1, position =$2, status =$3 WHERE job_id =$4 RETURNING *",
    [company, position, status, jobId]
  );

  if (!updatedJob) {
    throw new BadRequestError(`Pas de post avec l'id ${jobId}`);
  }

  res.status(200).json({ job: updatedJob });
};

//SUPPRIME UN JOB
const deleteJob = async (req, res) => {
  const { jobId } = req.params;

  if (isNaN(Number(id))) {
    throw new BadRequestError("Identifiant invalide");
  }

  const {
    rows: [deleteJob],
  } = await db.query("DELETE FROM jobs WHERE job_id =$1", [jobId]);

  if (!deleteJob) {
    throw new NotFoundError(`Pas de poste avec l'id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job: deleteJob });
};

module.exports = {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
};
