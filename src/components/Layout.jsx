import React from 'react';

import Navbar from './Navbar';

import './Layout.css';

function Layout({

    children,
    title,

}) {

    return (

        <div className="layout">

            <div className="main-layout">

                <Navbar title={title} />

                <div className="page-content">

                    {children}

                </div>

            </div>

        </div>

    );

}

export default Layout;