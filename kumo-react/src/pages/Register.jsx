import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, CircleUserRound, Eye, EyeOff, ShieldCheck, } from 'lucide-react'; 
import logo from '../assets/kumo-logo.png';
import '../styles/register-style.css';

const emptyCredentials = {
  username: '',
  email: '',
  password: '',
  repeatPassword: '',
};

const fieldLabels = {
  username: 'Username',
  email: 'Email address',
  password: 'Password',
  repeatPassword: 'Repeat password',
};

function validate(values) {
  const errors = {};

  Object.keys(fieldLabels).forEach((field) => {
    if (!values[field].trim()) {
      errors[field] = `${fieldLabels[field]} is required.`;
    }
  });

  if (
    values.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
  ) {
    errors.email = 'Enter a valid email address.';
  }

  if ( values.password && values.repeatPassword && values.password !== values.repeatPassword ) { errors.repeatPassword = 'Passwords do not match.'; }
  return errors;
}

function RegisterForm({ role }) {
  const [values, setValues] = useState(emptyCredentials);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);

  const isMerchant = role === 'merchant';
  const roleName = isMerchant ? 'Merchant' : 'Customer';
  const roleId = role;

  const update = (field, value) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setNotice('');

    setErrors((current) => {
      if (
        !current[field] &&
        field !== 'password' &&
        field !== 'repeatPassword'
      ) {
        return current;
      }

      const next = { ...current };
      delete next[field];

      if (
        (field === 'password' || field === 'repeatPassword') &&
        values.password &&
        value
      ) {
        const other =
          field === 'password'
            ? values.repeatPassword
            : values.password;

        if (other && value !== other) {
          next.repeatPassword = 'Passwords do not match.';
        } else {
          delete next.repeatPassword;
        }
      }

      return next;
    });
  };

  const submit = (event) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    setNotice('');

    if (Object.keys(nextErrors).length) {
      const firstInvalid = Object.keys(nextErrors)[0];

      document.getElementById(`${roleId}-${firstInvalid}`)?.focus();
      return;
    }

    // Registration is not connected to a backend.
    // Credentials are not sent or stored.
    setValues({ ...emptyCredentials });
    setNotice(
      'Registration isn’t connected yet. Your details have not been saved.'
    );
  };

  const renderField = (field) => {
    const isPassword =
      field === 'password' || field === 'repeatPassword';

    const shown =
      field === 'password' ? showPassword : showRepeat;

    const type = isPassword
      ? shown
        ? 'text'
        : 'password'
      : field === 'email'
        ? 'email'
        : 'text';

    const testId = `input-${roleId}-${
      field === 'repeatPassword' ? 'repeat-password' : field
    }`;

    const label = fieldLabels[field];

    return (
      <div className="register-field" key={field}>
        <label htmlFor={`${roleId}-${field}`}>
          {label}
          <span aria-hidden="true"> *</span>
        </label>

        <div
          className={`register-input-wrap ${
            errors[field] ? 'has-error' : ''
          }`}
        >
          <input
            id={`${roleId}-${field}`}
            name={field}
            type={type}
            value={values[field]}
            onChange={(event) => update(field, event.target.value)}
            autoComplete={
              field === 'username'
                ? 'username'
                : field === 'email'
                  ? 'email'
                  : 'new-password'
            }
            required
            aria-invalid={Boolean(errors[field])}
            aria-describedby={
              errors[field] ? `${roleId}-${field}-error` : undefined
            }
            data-testid={testId}
          />

          {isPassword && (
            <button
              className="password-toggle"
              type="button"
              onClick={() =>
                field === 'password'
                  ? setShowPassword(!shown)
                  : setShowRepeat(!shown)
              }
              aria-label={`${
                shown ? 'Hide' : 'Show'
              } ${
                field === 'password'
                  ? 'password'
                  : 'repeated password'
              }`}
              data-testid={`button-${roleId}-toggle-${field}`}
            >
              {shown ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>

        {errors[field] && (
          <span
            className="field-error"
            id={`${roleId}-${field}-error`}
            data-testid={`error-${roleId}-${field}`}
            role="alert"
          >
            {errors[field]}
          </span>
        )}
      </div>
    );
  };

  return (
    <section
      className={`register-card ${
        isMerchant ? 'merchant-card' : 'customer-card'
      }`}
      aria-labelledby={`${roleId}-heading`}
    >
      <div className="register-card-head">
        <div className="role-mark" aria-hidden="true">
          {isMerchant ? (
            <BriefcaseBusiness size={19} />
          ) : (
            <CircleUserRound size={19} />
          )}
        </div>

        <div className="role-caption">
          {isMerchant
            ? 'FOR THE ONES BUILDING'
            : 'FOR THE ONES SHOPPING'}
        </div>

        <h2 id={`${roleId}-heading`}>
          {roleName}
          <span>.</span>
        </h2>

        <p>
          {isMerchant
            ? 'Bring your shop into sharper focus.'
            : 'A simpler way to stay close to the brands you love.'}
        </p>
      </div>

      <form
        noValidate
        onSubmit={submit}
        className="register-form"
        aria-label={`${roleName} registration`}
      >
        {renderField('username')}
        {renderField('email')}
        {renderField('password')}
        {renderField('repeatPassword')}

        <button
          className={`register-submit ${
            isMerchant ? 'submit-gold' : 'submit-ink'
          }`}
          type="submit"
          data-testid={`button-register-${roleId}`}
        >
          Register as a {roleName}
          <ArrowRight size={16} />
        </button>

        <div
          className="registration-notice"
          role="status"
          aria-live="polite"
          data-testid={`status-register-${roleId}`}
        >
          {notice && (
            <>
              <Check size={16} />
              <span>{notice}</span>
            </>
          )}
        </div>
      </form>
    </section>
  );
}

export default function RegisterPage() {
  const [activeRole, setActiveRole] = useState('customer');

  useEffect(() => {
    const previousTitle = document.title;

    const description = document.querySelector(
      'meta[name="description"]'
    );
    const previousDescription = description?.content;

    const openGraphTitle = document.querySelector(
      'meta[property="og:title"]'
    );
    const previousOpenGraphTitle = openGraphTitle?.content;

    const openGraphDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    const previousOpenGraphDescription =
      openGraphDescription?.content;

    document.title = 'Create your KUMO account';

    if (description) {
      description.content =
        'Choose a Customer or Merchant account for KUMO Commerce.';
    }

    if (openGraphTitle) {
      openGraphTitle.content = 'Create your KUMO account';
    }

    if (openGraphDescription) {
      openGraphDescription.content =
        'Choose a Customer or Merchant account for KUMO Commerce.';
    }

    return () => {
      document.title = previousTitle;

      if (description && previousDescription !== undefined) {
        description.content = previousDescription;
      }

      if (
        openGraphTitle &&
        previousOpenGraphTitle !== undefined
      ) {
        openGraphTitle.content = previousOpenGraphTitle;
      }

      if (
        openGraphDescription &&
        previousOpenGraphDescription !== undefined
      ) {
        openGraphDescription.content =
          previousOpenGraphDescription;
      }
    };
  }, []);

  const handleRoleTabKeyDown = (event) => {
    const roles = ['customer', 'merchant'];
    const currentIndex = roles.indexOf(activeRole);
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % roles.length;
    }

    if (event.key === 'ArrowLeft') {
      nextIndex =
        (currentIndex - 1 + roles.length) % roles.length;
    }

    if (event.key === 'Home') {
      nextIndex = 0;
    }

    if (event.key === 'End') {
      nextIndex = roles.length - 1;
    }

    if (nextIndex !== currentIndex) {
      event.preventDefault();

      const nextRole = roles[nextIndex];
      setActiveRole(nextRole);

      document
        .getElementById(`register-tab-${nextRole}`)
        ?.focus();
    }
  };

  return (
    <main className="register-page">

      <div className="register-shell">
        <div className="register-intro">
          <div className="register-eyebrow">
            <span />
            A PLACE FOR EVERY SIDE OF THE SHOP
          </div>

          <h1>
            Good things
            <br />
            start with <em>you.</em>
          </h1>

          <p>
            Choose the side that feels like yours. Two ways in,
            one clearer view of commerce.
          </p>

          <div className="privacy-note">
            <ShieldCheck size={17} />
            <span>
              No credentials are sent or saved. Registration is
              not connected yet.
            </span>
          </div>
        </div>

        <div className="register-forms">
          <div
            className="register-tabs"
            role="tablist"
            aria-label="Choose account type"
          >
            <button
              id="register-tab-customer"
              className="register-tab"
              type="button"
              role="tab"
              aria-selected={activeRole === 'customer'}
              aria-controls="register-panel"
              tabIndex={activeRole === 'customer' ? 0 : -1}
              data-role="customer"
              data-testid="tab-customer"
              onClick={() => setActiveRole('customer')}
              onKeyDown={handleRoleTabKeyDown}
            >
              <CircleUserRound size={17} />
              <span>Customer</span>
              <small>Shop and discover</small>
            </button>

            <button
              id="register-tab-merchant"
              className="register-tab"
              type="button"
              role="tab"
              aria-selected={activeRole === 'merchant'}
              aria-controls="register-panel"
              tabIndex={activeRole === 'merchant' ? 0 : -1}
              data-role="merchant"
              data-testid="tab-merchant"
              onClick={() => setActiveRole('merchant')}
              onKeyDown={handleRoleTabKeyDown}
            >
              <BriefcaseBusiness size={17} />
              <span>Merchant</span>
              <small>Grow your shop</small>
            </button>
          </div>

          <div
            id="register-panel"
            className="register-panel"
            role="tabpanel"
            aria-labelledby={`register-tab-${activeRole}`}
            tabIndex={-1}
          >
            <RegisterForm key={activeRole} role={activeRole} />
          </div>
        </div>

        <footer className="register-footer">
          <span>
            KUMO COMMERCE / KNOW YOUR NUMBERS. GROW YOUR HUSTLE.
          </span>

          <a href="/" data-testid="link-register-footer">
            RETURN TO HOME
            <ArrowLeft size={12} />
          </a>
        </footer>
      </div>
    </main>
  );
}