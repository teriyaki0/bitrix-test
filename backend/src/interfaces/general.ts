import express from "express";

export type Loader = (app: express.Application) => void;
