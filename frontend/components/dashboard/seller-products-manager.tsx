'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { Alert, FieldError, Label, Spinner, inputClass, primaryButtonClass, secondaryButtonClass } from '@/components/ui';
import { publicAssetPath } from '@/lib/dashboard';
import { formatToman, toPersianNumber } from '@/lib/format';
import { deleteListing, patchProduct, postProduct } from '@/lib/shop-bag-api';
import type { ProductListing } from '@/types/api';

const KARATS = [18, 21, 22, 24] as const;

type FormState = {
  name: string;
  weightGrams: string;
  karat: string;
  price: string;
  description: string;
  quantity: string;
};

const EMPTY_FORM: FormState = {
  name: '',
  weightGrams: '',
  karat: '18',
  price: '',
  description: '',
  quantity: '',
};

export function SellerProductsManager({ initialItems }: { initialItems: ProductListing[] }) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [image, setImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const editing = items.find((item) => item.id === editingId) ?? null;
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setPreviewSrc(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewSrc(publicAssetPath(editing?.imageUrl) ?? null);
  }, [image, editing?.imageUrl]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setImage(null);
    setEditingId(null);
    setFieldError(null);
    setError(null);
  }

  function startEdit(item: ProductListing) {
    setEditingId(item.id);
    setImage(null);
    setFieldError(null);
    setError(null);
    setForm({
      name: item.name,
      weightGrams: String(item.weightGrams),
      karat: String(item.karat),
      price: String(item.price),
      description: item.description ?? '',
      quantity: item.quantity == null ? '' : String(item.quantity),
    });
  }

  function onImageChange(event: ChangeEvent<HTMLInputElement>) {
    setImage(event.target.files?.[0] ?? null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldError(null);

    const name = form.name.trim();
    const weightGrams = Number(form.weightGrams);
    const karat = Number(form.karat);
    const price = Number(form.price);
    const quantity = form.quantity.trim() === '' ? undefined : Number(form.quantity);

    if (name.length < 2) {
      setFieldError('نام محصول را وارد کنید.');
      return;
    }
    if (!Number.isFinite(weightGrams) || weightGrams <= 0) {
      setFieldError('وزن باید بیشتر از صفر باشد.');
      return;
    }
    if (![18, 21, 22, 24].includes(karat)) {
      setFieldError('عیار معتبر نیست.');
      return;
    }
    if (!Number.isInteger(price) || price < 0) {
      setFieldError('قیمت را به تومان و به‌صورت عدد صحیح وارد کنید.');
      return;
    }
    if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
      setFieldError('موجودی باید صفر یا بیشتر باشد.');
      return;
    }

    const body = new FormData();
    body.set('name', name);
    body.set('weightGrams', String(weightGrams));
    body.set('karat', String(karat));
    body.set('price', String(price));
    body.set('description', form.description.trim());
    body.set('quantity', quantity === undefined ? '' : String(quantity));
    if (image) body.set('image', image);

    setPending(true);
    try {
      if (editingId) {
        const updated = await patchProduct(editingId, body);
        setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await postProduct(body);
        setItems((current) => [created, ...current]);
      }
      resetForm();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'ذخیره محصول ناموفق بود.');
    } finally {
      setPending(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm('این محصول حذف شود؟')) return;
    setError(null);
    setPending(true);
    try {
      await deleteListing(id);
      setItems((current) => current.filter((item) => item.id !== id));
      if (editingId === id) resetForm();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'حذف محصول ناموفق بود.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-2xl border border-border/80 bg-surface">
        <div className="flex items-center justify-between gap-4 border-b border-border/70 px-6 py-4">
          <div>
            <h2 className="text-sm font-medium">{editingId ? 'ویرایش محصول' : 'افزودن محصول طلا'}</h2>
            <p className="mt-1 text-xs text-muted">
              {editingId
                ? 'تغییرات روی همین کارت در فروشگاه عمومی اعمال می‌شود.'
                : 'محصول در لیست عمومی فروشگاه نمایش داده می‌شود.'}
            </p>
          </div>
          {editingId ? (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted transition hover:bg-background-elevated hover:text-foreground"
              onClick={resetForm}
            >
              <X className="size-3.5" aria-hidden />
              انصراف
            </button>
          ) : null}
        </div>

        <form onSubmit={onSubmit} className="grid gap-5 px-6 py-6 sm:grid-cols-2">
          {error ? (
            <div className="sm:col-span-2">
              <Alert>{error}</Alert>
            </div>
          ) : null}

          <div className="sm:col-span-2">
            <Label htmlFor="product-name">نام محصول</Label>
            <input
              id="product-name"
              className={inputClass}
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
              placeholder="سکه بهار آزادی"
              disabled={pending}
              required
            />
          </div>

          <div>
            <Label htmlFor="product-weight">وزن (گرم)</Label>
            <input
              id="product-weight"
              className={inputClass}
              type="number"
              min="0.01"
              step="0.01"
              value={form.weightGrams}
              onChange={(event) => setField('weightGrams', event.target.value)}
              placeholder="۸.۱۳"
              disabled={pending}
              required
            />
          </div>

          <div>
            <Label htmlFor="product-karat">عیار طلا</Label>
            <select
              id="product-karat"
              className={inputClass}
              value={form.karat}
              onChange={(event) => setField('karat', event.target.value)}
              disabled={pending}
            >
              {KARATS.map((value) => (
                <option key={value} value={value}>
                  {toPersianNumber(value)} عیار
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="product-price">قیمت (تومان)</Label>
            <input
              id="product-price"
              className={inputClass}
              type="number"
              min="0"
              step="1"
              value={form.price}
              onChange={(event) => setField('price', event.target.value)}
              placeholder="۴۲۰۰۰۰۰۰"
              disabled={pending}
              required
            />
          </div>

          <div>
            <Label htmlFor="product-quantity">موجودی (اختیاری)</Label>
            <input
              id="product-quantity"
              className={inputClass}
              type="number"
              min="0"
              step="1"
              value={form.quantity}
              onChange={(event) => setField('quantity', event.target.value)}
              placeholder="۳"
              disabled={pending}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="product-description">توضیحات کوتاه (اختیاری)</Label>
            <textarea
              id="product-description"
              className={`${inputClass} min-h-24 resize-y`}
              value={form.description}
              onChange={(event) => setField('description', event.target.value)}
              placeholder="دستبند طلا ۱۸ عیار با قفل ایمنی"
              disabled={pending}
              maxLength={2000}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="product-image">عکس محصول</Label>
            <input
              id="product-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className={inputClass}
              onChange={onImageChange}
              disabled={pending}
            />
            <p className="mt-1.5 text-xs text-muted">
              {image?.name ?? (editingId ? 'برای نگه‌داشتن عکس فعلی خالی بگذارید.' : 'JPG، PNG، WEBP یا GIF · حداکثر ۲ مگابایت')}
            </p>
            {previewSrc ? (
              // eslint-disable-next-line @next/next/no-img-element -- object URL / upload host
              <img src={previewSrc} alt="" className="mt-3 h-28 w-28 rounded-xl object-cover ring-1 ring-border" />
            ) : null}
          </div>

          {fieldError ? (
            <div className="sm:col-span-2">
              <FieldError>{fieldError}</FieldError>
            </div>
          ) : null}

          <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row">
            <button type="submit" className={`${primaryButtonClass} sm:w-auto sm:px-8`} disabled={pending}>
              {pending ? <Spinner /> : <Plus className="size-4" aria-hidden />}
              {editingId ? 'ذخیره تغییرات' : 'افزودن محصول'}
            </button>
            {editingId ? (
              <button
                type="button"
                className={`${secondaryButtonClass} sm:w-auto sm:px-6`}
                onClick={resetForm}
                disabled={pending}
              >
                انصراف
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium">محصولات مغازه</h2>
            <p className="mt-1 text-xs text-muted">
              {items.length
                ? `${toPersianNumber(items.length)} محصول در فروشگاه عمومی دیده می‌شود.`
                : 'هنوز محصولی ثبت نکرده‌اید.'}
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-surface px-6 py-12 text-center text-sm text-muted">
            فرم بالا را پر کنید تا اولین قطعه طلا به کاتالوگ اضافه شود.
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const src = publicAssetPath(item.imageUrl);
              return (
                <li
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.04)]"
                >
                  <div className="aspect-[4/3] bg-background-elevated">
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element -- upload host is rewritten
                      <img src={src} alt={item.name} className="size-full object-cover" />
                    ) : (
                      <div className="grid size-full place-items-center text-gold-700">بدون عکس</div>
                    )}
                  </div>
                  <div className="space-y-3 p-4">
                    <div>
                      <h3 className="truncate text-sm font-medium">{item.name}</h3>
                      <p className="mt-1 text-sm text-gold-700">{formatToman(item.price)}</p>
                      <p className="mt-1 text-xs text-muted">
                        {toPersianNumber(item.weightGrams)} گرم · عیار {toPersianNumber(item.karat)}
                        {item.quantity != null ? ` · موجودی ${toPersianNumber(item.quantity)}` : ''}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gold-500/10 px-2.5 py-1.5 text-xs font-medium text-gold-700 transition hover:bg-gold-500/20"
                        onClick={() => startEdit(item)}
                        disabled={pending}
                      >
                        <Pencil className="size-3.5" aria-hidden />
                        ویرایش
                      </button>
                      <button
                        type="button"
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted transition hover:bg-background-elevated hover:text-foreground"
                        onClick={() => void onDelete(item.id)}
                        disabled={pending}
                      >
                        <Trash2 className="size-3.5" aria-hidden />
                        حذف
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
