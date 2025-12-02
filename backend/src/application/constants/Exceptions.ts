export class ApplicationException extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UserNotFoundException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class UserAlreadyExistingException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class UserIsBlockedException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidOTPException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class UserDataMissingException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class PasswordNotMatchingException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class TokenExpiredException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class TokenMissingException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class OTPExpiredException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class InvalideDataException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidOperationException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class ConflictException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}
