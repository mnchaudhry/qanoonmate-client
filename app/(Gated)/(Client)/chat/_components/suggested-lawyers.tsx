import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Lawyer } from "@/store/types/lawyer.types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Lawyer1 } from "@/constants/images";
import { useStateContext } from "@/context/useStateContext";
import Image from "next/image";

const SuggestedLawyers = ({ }: { lawyers: Lawyer[] }) => {

    const router = useRouter();
    const { setSelectedLawyer } = useStateContext();
    const { lawyers } = useSelector((state: RootState) => state.lawyer)

    const onProceed = (lawyer: Lawyer) => {
        router.push(`/client/consultations/book?lawyerId=${lawyer?._id}`);
        setSelectedLawyer(lawyer);
    }

    return (
        <div className="w-full p-4">
            <h2 className="text-lg font-semibold mb-3">Suggested to You</h2>
            <div className="flex gap-4 w-full overflow-x-auto pb-3 ">
                {lawyers.slice(0, 8).map((lawyer: Lawyer) => (
                    <Card key={lawyer._id} className="min-w-[200px] p-3 shadow-md">
                        <CardContent className="flex flex-col justify-between items-center gap-2 h-full p-0">
                            <div className="flex flex-col items-center text-center">
                                <Image
                                    src={lawyer.profilePicture || Lawyer1}
                                    alt={lawyer.firstname}
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 rounded-full mb-2 object-cover"
                                />
                                <h3 className="text-sm font-semibold">{lawyer.firstname}</h3>
                                <p className="text-xs text-muted-foreground">{lawyer.specializations}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span className="text-xs">{lawyer.avgRating}</span>
                                </div>
                            </div>
                            <div className="">
                                <Button onClick={() => onProceed(lawyer)} className="py-1.5 px-2 text-xs" >Book Consultation</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SuggestedLawyers;