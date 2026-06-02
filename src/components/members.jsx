import React from 'react';
import Layout
    from '../components/Layout'
import MemberGrid from './membergrid';

function members() {

    return (
        <Layout title="Members">
            <div>

                <MemberGrid

                    pageSize={50}

                    height={600}

                    showToolbar={true}

                />

            </div>
        </Layout>
    );

}

export default members;