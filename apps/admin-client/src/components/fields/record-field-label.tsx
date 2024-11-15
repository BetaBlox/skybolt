import { Label } from '@/components/label';
import { ModelField } from '@repo/types/admin';
import { captilalize } from '@repo/utils';

interface Props {
  field: ModelField;
  required?: boolean;
}
export default function FieldLabel({ field, required }: Props) {
  const renderRequiredAsterisk = () => {
    // Allow an override for fields marked required
    //  1) Fields that have a default value
    //  2) Boolean field checkboxes which always have a value (true/false)
    if (required === false) {
      return null;
    }

    if (field.isRequired) {
      return <span className="text-red-600">*</span>;
    }

    return null;
  };

  return (
    <Label>
      {captilalize(field.name)} {renderRequiredAsterisk()}
    </Label>
  );
}
