export const validateAmount = (amount: string): string | null => {
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount)) {
        return 'Please enter a valid number';
    }

    if (numAmount <= 0) {
        return 'Amount must be greater than 0';
    }

    if (numAmount > 1000000000) {
        return 'Amount is too large';
    }

    return null;
};

export const validateDescription = (description: string): string | null => {
    if (!description.trim()) {
        return 'Description is required';
    }

    if (description.length > 200) {
        return 'Description must be less than 200 characters';
    }

    return null;
};

export const validateCategory = (category: string): string | null => {
    if (!category || category === '') {
        return 'Please select a category';
    }

    return null;
};

export const validateDate = (date: string): string | null => {
    if (!date) {
        return 'Date is required';
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (selectedDate > today) {
        return 'Date cannot be in the future';
    }

    return null;
};
