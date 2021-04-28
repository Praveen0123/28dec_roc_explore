export const ERROR_STORE_FEATURE_KEY = 'errors';


export interface ErrorsState
{
  errorType: string;
  message: string;
}

export const initialErrorsState: ErrorsState =
{
  errorType: null,
  message: null
};
