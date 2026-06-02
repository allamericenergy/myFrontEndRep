import React from 'react';
import Layout
    from '../components/Layout'
import ContractsGrid from './contractGrid';

function contracts() {

    return (
        <Layout title="contracts">
            <div>

                <ContractsGrid

                    pageSize={50}

                    height={600}

                    showToolbar={true}

                />

            </div>
        </Layout>
    );

}

export default contracts;