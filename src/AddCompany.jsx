import React, {
    useState
} from 'react';

import './AddCompany.css';

function AddCompany({
    fetchCompanies,
    closePopup
}) {

    const [formData, setFormData] =
        useState({

            CompanyName: '',
            LegalEntityName: '',
            MailingAddress: '',
            PhoneNumber: '',
            TaxID: '',
            URL: '',
            contractsFolderId: 'vxcvcv',
            UtilityBillsfolderId: 'vcxvxcvxc'

        });

    const [loading, setLoading] =
        useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const token =
                localStorage.getItem('token');
const API = import.meta.env.VITE_API_URL;
            const res = await fetch(
                `${API}/api/auth/add-company`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json',

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify(
                        formData
                    ),
                }
            );

            const data =
                await res.json();

            // alert(data.message);

            setFormData({
                CompanyName: '',
                LegalEntityName: '',
                MailingAddress: '',
                PhoneNumber: '',
                TaxID: '',
                URL: '',
                contractsFolderId: 'vxcvcv',
                UtilityBillsfolderId: 'vcxvxcvxc'
            });

            fetchCompanies();

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="add-company-card">

            <form
                onSubmit={handleSubmit}
                className="company-form"
            >
                <input
                    type="text"
                    name="CompanyName"
                    placeholder="Company Name"
                    value={
                        formData.CompanyName
                    }
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="LegalEntityName"
                    placeholder="Legal Entity Name"
                    value={
                        formData.LegalEntityName
                    }
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="PhoneNumber"
                    placeholder="Phone Number"
                    value={
                        formData.PhoneNumber
                    }
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="TaxID"
                    placeholder="Tax ID"
                    value={
                        formData.TaxID
                    }
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="URL"
                    placeholder="Website URL"
                    value={
                        formData.URL
                    }
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="MailingAddress"
                    placeholder="Mailing Address"
                    value={
                        formData.MailingAddress
                    }
                    onChange={handleChange}
                />


                <button
                    type="submit"
                    className="save-btn"
                >
                    {
                        loading
                            ? 'Saving...'
                            : 'Add Company'
                    }
                </button>

            </form>

        </div>
    );
}

export default AddCompany;
