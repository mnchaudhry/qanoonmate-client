"use client";

import { ReactNode } from 'react'


const LandingPageLayout = ({ children }: { children: ReactNode }) => {

    // const { isBetaUser, setIsBetaUser } = useStateContext();
    // const { isAuthenticated } = useSelector((state: RootState) => state.auth)

    // useEffect(() => {
    //     const isIt = localStorageManager.getItem('beta_user') as boolean;
    //     if (isIt) {
    //         setIsBetaUser(isIt);
    //     }
    // }, [setIsBetaUser]);

    return (
        // (isBetaUser || isAuthenticated)
        // ?
        children
        // :
        // <ComingSoonWrapper
        // title="Your AI-Powered Legal Companion is Arriving"
        // description="Law made accessible. Insights made simple."
        // estimatedDate="Launching August 20, 2025"
        // >
        // <></>
        // </ComingSoonWrapper>
    )
}

export default LandingPageLayout