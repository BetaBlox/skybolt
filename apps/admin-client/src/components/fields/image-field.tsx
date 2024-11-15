import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ModelField } from '@repo/types/admin';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import FieldLabel from '@/components/fields/record-field-label';
import { Asset } from '@repo/database';

interface Props {
  field: ModelField;
  asset?: Asset | null;
  onChange: (key: string, value: File | null) => void;
}

export default function ImageField({ field, asset, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (asset) {
      setPreview(asset.fileUrl);
    }
  }, [asset]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Generate a preview URL for the selected file
      const fileUrl = URL.createObjectURL(file);
      setPreview(fileUrl);
      onChange(field.name, file); // Clear the image field in the form
    }
  };

  const removeImage = () => {
    setPreview(null);
    onChange(field.name, null);
  };

  return (
    <div>
      <FieldLabel field={field} />
      <div className="mt-2">
        {preview && (
          <div className="mb-4">
            <img src={preview} className="h-24 rounded border object-cover" />
          </div>
        )}

        <div>
          <div className="flex flex-row gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => inputRef?.current?.click()}
            >
              {preview ? 'Change Photo' : 'Upload Photo'}
            </Button>
            {preview && (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={removeImage}
              >
                Remove
              </Button>
            )}
          </div>
        </div>

        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
}
