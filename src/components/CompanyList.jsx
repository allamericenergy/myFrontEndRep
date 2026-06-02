import React from 'react';
import Layout
    from '../components/Layout'
import CompaniesGrid from '../CompaniesGrid';

function CompanyList() {

    return (
        <Layout title="Companies">
            <div>

                <CompaniesGrid

                    pageSize={50}

                    height={600}

                    showToolbar={true}

                />

            </div>
        </Layout>
    );

}

export default CompanyList;