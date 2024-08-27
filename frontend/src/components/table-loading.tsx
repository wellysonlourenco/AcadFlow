import { Skeleton } from "./ui/skeleton";

export const TableLoading = () => {
    return (
        <div className="space-y-2">
            {[...Array(10)].map((_, index) => (
                <div key={index} className="flex space-x-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                </div>
            ))}
        </div>
    );
};
