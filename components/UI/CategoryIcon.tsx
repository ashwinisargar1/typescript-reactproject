import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface CategoryIconProps extends LucideProps {
    name: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
    const IconComponent = (LucideIcons as any)[name];

    if (!IconComponent) {
        return <LucideIcons.HelpCircle {...props} />;
    }

    return <IconComponent {...props} />;
};

export default CategoryIcon;
