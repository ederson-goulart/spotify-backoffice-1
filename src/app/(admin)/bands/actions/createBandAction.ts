"use server";

export type CreateBandFormState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function createBandAction(
  _prevState: CreateBandFormState,
  formData: FormData,
): Promise<CreateBandFormState> {
  console.log("Estado Inicial: ", _prevState);
  console.log("Chegamos na server action no back-end: ", formData);
  return { ok: true };
}
