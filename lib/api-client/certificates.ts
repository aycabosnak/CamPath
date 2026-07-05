/** lib/api-client/certificates.ts — See API doc 4.8. Download-only by
 *  approved MVP decision — no social share endpoint exists. */
import { apiRequest } from "./index";
import type { Certificate } from "@/types/entities";

export function getMyCertificates() {
  return apiRequest<Certificate[]>("/users/me/certificates");
}

export function getCertificatePdfUrl(id: string) {
  return `/api/certificates/${id}/pdf`;
}
