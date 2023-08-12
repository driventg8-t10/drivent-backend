import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares";
import httpStatus from "http-status";
import certificateService from "../services/certificate-service";

export async function getCertificate(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const certificate = await certificateService.generateCertificate(userId);
    res.setHeader("Content-Disposition", "attachment; filename=certificado.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.status(httpStatus.OK).send(certificate);
  } catch (err) {
    if (err.name === "NotEnoughActivitiesError") {
      return res.status(httpStatus.FORBIDDEN).send({
        status: 403,
        message: err.message,
      });
    } else {
      throw err;
    }
  }
}
