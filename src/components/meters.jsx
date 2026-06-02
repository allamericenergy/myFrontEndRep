import React from 'react';
import Layout
    from '../components/Layout';
    import MeterGrid from './meterGrid.jsx';


function CompanyList() {

    return (
        <Layout title="Meters">
            <div>

                <MeterGrid/>

            </div>
        </Layout>
    );

}

export default CompanyList;