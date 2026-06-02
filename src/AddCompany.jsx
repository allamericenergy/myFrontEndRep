import React, {
    useState,
    useEffect
} from 'react';

import './AddCompany.css';

function AddCompany({
    fetchCompanies,
    closePopup,
    selectedCompany,
    mode,
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
            UtilityBillsfolderId: 'vcxvxcvxc',

        });

    const [loading, setLoading] =
        useState(false);

    const API = import.meta.env.VITE_API_URL;

    // EDIT MODE PREFILL

    useEffect(() => {

        if (
            mode === 'edit' &&
            selectedCompany
        ) {

            setFormData({

                CompanyName:
                    selectedCompany[
                    'Company Name'
                    ] || '',

                LegalEntityName:
                    selectedCompany[
                    'Legal Entity Name'
                    ] || '',

                MailingAddress:
                    selectedCompany[
                    'Mailing Address'
                    ] || '',

                PhoneNumber:
                    selectedCompany[
                    'Phone Number'
                    ] || '',

                TaxID:
                    selectedCompany[
                    'Tax ID'
                    ] || '',

                URL:
                    selectedCompany[
                    'URL'
                    ] || '',

                contractsFolderId:
                    selectedCompany[
                    'contractsFolderId'
                    ] || 'vxcvcv',

                UtilityBillsfolderId:
                    selectedCompany[
                    'UtilityBillsfolderId'
                    ] || 'vcxvxcvxc',

            });

        }

    }, [selectedCompany, mode]);

    // INPUT CHANGE

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        });

    };

    // SUBMIT

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const token =
                localStorage.getItem('token');

            const url =
                mode === 'edit'
                    ? `${API}/api/auth/company/${selectedCompany.id}`
                    : `${API}/api/auth/add-company`;

            const method =
                mode === 'edit'
                    ? 'PUT'
                    : 'POST';

            const res = await fetch(url, {

                method,

                headers: {

                    'Content-Type':
                        'application/json',

                    Authorization:
                        `Bearer ${token}`,
                },

                body: JSON.stringify(
                    formData
                ),

            });

            const data =
                await res.json();

            console.log(data);

            fetchCompanies();

            closePopup();

            // RESET FORM

            setFormData({

                CompanyName: '',
                LegalEntityName: '',
                MailingAddress: '',
                PhoneNumber: '',
                TaxID: '',
                URL: '',
                contractsFolderId: 'vxcvcv',
                UtilityBillsfolderId: 'vcxvxcvxc',

            });

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
                            : mode === 'edit'
                                ? 'Update Company'
                                : 'Add Company'
                    }

                </button>

            </form>

        </div>
    );
}

export default AddCompany;
