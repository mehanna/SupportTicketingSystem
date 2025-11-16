export const getPriorityClass = (priority: string) => {
        switch (priority) {
            case 'High':
                return 'bg-red-100 text-red-800';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-green-100 text-green-800';
        }
    };

