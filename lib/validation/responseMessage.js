const successMessage = {
  emailScheduled: 'EMAIL_SCHEDULED',
  emailRescheduled: 'EMAIL_RESCHEDULED',
  emailDeleted: 'EMAIL_DELETED',
};

const errorMessage = {
  invalidEmailFormat: 'INVALID_EMAIL_FORMAT',
  UnAuthorized: 'UNAUTHORIZED_ACTION',
  EmailError: 'EMAIL_NOT_FOUND',
  invalidFormat: 'INVALID_FORMAT',
  invalidDateFormat: 'INVALID_DATE_FORMAT',
  invalidDateTimeFormat: 'TIME_HAS_ALREADY_PASSED',
  emailNotRescheduled: 'EMAIL_NOT_RESCHEDULED',
  notFound: 'NOT_FOUND',
};

const validationMessage = {
  emailFormat: 'INVALID_EMAIL_FORMAT',
  emailRequired: 'ENTER_EMAIL',
};

module.exports = {
  successMessage,
  errorMessage,
  validationMessage,
};

