import type { ChangeEvent } from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import type { AccountRole } from '@/lib/validation';

export function AccountTypeFields({
  role,
  onRoleChange,
  shopName,
  shopNameError,
  onLogoChange,
  logoFileName,
  disabled,
}: {
  role: AccountRole;
  onRoleChange: (role: AccountRole) => void;
  shopName: UseFormRegisterReturn;
  shopNameError?: FieldError;
  onLogoChange: (file: File | null) => void;
  logoFileName: string | null;
  disabled?: boolean;
}) {
  function handleLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    onLogoChange(file);
  }

  return (
    <>
      <fieldset className="shop-auth-fieldset" disabled={disabled}>
        <legend>Account type</legend>
        <div className="shop-auth-roles" role="tablist" aria-label="Account type">
          <button
            type="button"
            role="tab"
            aria-selected={role === 'BUYER'}
            className={role === 'BUYER' ? 'shop-auth-role is-active' : 'shop-auth-role'}
            onClick={() => onRoleChange('BUYER')}
          >
            Buyer
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === 'SELLER'}
            className={role === 'SELLER' ? 'shop-auth-role is-active' : 'shop-auth-role'}
            onClick={() => onRoleChange('SELLER')}
          >
            Seller
          </button>
        </div>
      </fieldset>

      {role === 'SELLER' ? (
        <div className="shop-auth-seller">
          <div className="shop-auth-field">
            <label htmlFor="shopName">Shop name</label>
            <input
              id="shopName"
              type="text"
              autoComplete="organization"
              placeholder="Shop name"
              disabled={disabled}
              aria-invalid={Boolean(shopNameError)}
              {...shopName}
            />
            {shopNameError?.message ? (
              <p className="shop-auth-field-error">{shopNameError.message}</p>
            ) : null}
          </div>

          <div className="shop-auth-field">
            <label htmlFor="logo">Shop logo (optional)</label>
            <input
              id="logo"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={disabled}
              onChange={handleLogo}
            />
            <p className="shop-auth-hint">
              {logoFileName ? logoFileName : 'JPG, PNG, WEBP or GIF · max 2 MB'}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
