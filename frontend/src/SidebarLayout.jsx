import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const SidebarLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

    // useEffect(() => {
    //     if (isOpen) {
    //         document.body.classList.remove('sidebar-closed');
    //     } else {
    //         document.body.classList.add('sidebar-closed');
    //     }
    // }, [isOpen]);

    return (
        <div className='layout-container'>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className={`content-container ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <Outlet />
            </div>
        </div>
    );
};

export default SidebarLayout;
