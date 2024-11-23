import React from 'react';

interface BaseFieldProps {
    label: string;
    id: string;
    name: string;
    placeholder?: string;
    type?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}

const BaseField: React.FC<BaseFieldProps> = ({
    label,
    id,
    name,
    placeholder,
    type = "text",
    value,
    defaultValue,
    onChange,
    disabled,
}) => (
    <div className="col-md-6">
        <label htmlFor={id} className="form-label">{label}</label>
        <input
            type={type}
            className="form-control"
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            defaultValue={defaultValue}
        />
    </div>
);

const InputField: React.FC<BaseFieldProps> = (props) => <BaseField {...props} />;

const PasswordField: React.FC<{
    label: string;
    id: string;
    name: string;
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}> = ({ label, id, name, visible, setVisible, value, onChange }) => (
    <div className="form-password-toggle col-md-12">
        <label className="form-label" htmlFor={id}>{label}</label>
        <div className="input-group input-group-merge">
            <input
                type={visible ? "text" : "password"}
                id={id}
                className="form-control"
                name={name}
                placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                aria-describedby={id}
                required
                value={value}
                onChange={onChange}
            />
            <span className="input-group-text cursor-pointer" onClick={() => setVisible(!visible)}>
                <i className={`bx ${visible ? 'bx-show' : 'bx-hide'}`}></i>
            </span>
        </div>
    </div>
);

const ConfirmPasswordField: React.FC<{
    label: string;
    id: string;
    name: string;
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}> = ({ label, id, name, visible, setVisible, value, onChange }) => (
    <div className="form-password-toggle col-md-6">
        <label className="form-label" htmlFor={id}>{label}</label>
        <div className="input-group input-group-merge">
            <input
                type={visible ? "text" : "password"}
                id={id}
                className="form-control"
                name={name}
                placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                aria-describedby={id}
                required
                value={value}
                onChange={onChange}
            />
            <span className="input-group-text cursor-pointer" onClick={() => setVisible(!visible)}>
                <i className={`bx ${visible ? 'bx-show' : 'bx-hide'}`}></i>
            </span>
        </div>
    </div>
);

interface PhoneNumberFieldProps {
    value?: string;
    defaultValue?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({ value, defaultValue, onChange }) => (
    <div className="col-md-6">
        <label htmlFor="modalEditUserPhone" className="form-label">Phone Number</label>
        <div className="input-group">
            <span className="input-group-text">VN(+84)</span>
            <input
                type="tel"
                className="form-control"
                id="modalEditUserPhone"
                name="phoneNumber"
                placeholder="032 123 4567"
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
            />
        </div>
    </div>
);





interface SelectFieldProps {
    label: string;
    id: string;
    name?: string;
    value?: string;
    defaultValue?: string;
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
    options: { value: string; label: string }[];
    disabled?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
    label,
    id,
    name,
    value,
    defaultValue,
    onChange,
    options,
    disabled = false,
}) => (
    <div className="col-md-6">
        <label htmlFor={id} className="form-label">{label}</label>
        <select
            id={id}
            className="form-select"
            name={name}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            disabled={disabled}
        >
            <option value="">Select {label}</option>
            {
                options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))
            }
        </select>
    </div>
);

export { InputField, PasswordField, ConfirmPasswordField, PhoneNumberField, SelectField };
