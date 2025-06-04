import React, { useEffect } from 'react';

const IdList = () => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                }
            });
        });

        const elements = document.querySelectorAll('[id]');
        elements.forEach(element => observer.observe(element));

        return () => {
            elements.forEach(element => observer.unobserve(element));
        };
    }, []);

    return null; // Ekranda hech narsa ko'rsatmaydi
};

export default IdList;