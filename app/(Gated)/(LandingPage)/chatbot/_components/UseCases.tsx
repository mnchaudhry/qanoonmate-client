import React from 'react'
import { Briefcase, FileText, Users, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

const useCasesData = [
    {
        title: 'Employment Law',
        description: 'Understand your rights in case of wrongful termination.',
        icon: <Briefcase className="w-6 h-6 text-primary-600" />,
    },
    {
        title: 'Contract Review',
        description: 'Get clarity on terms and conditions in your agreements.',
        icon: <FileText className="w-6 h-6 text-primary-600" />,
    },
    {
        title: 'Labor Rights',
        description: 'Learn about your rights concerning workplace harassment and other labor laws.',
        icon: <Users className="w-6 h-6 text-primary-600" />,
    },
    {
        title: 'Intellectual Property',
        description: 'Protect your creative works, patents, and trademarks.',
        icon: <Shield className="w-6 h-6 text-primary-600" />,
    },
    {
        title: 'Family Law',
        description: 'Get assistance on divorce, child custody, and other family-related issues.',
        icon: <Users className="w-6 h-6 text-primary-600" />,
    },
    {
        title: 'Estate Planning',
        description: 'Plan your estate and ensure your wishes are respected after death.',
        icon: <FileText className="w-6 h-6 text-primary-600" />,
    },
]

// const UseCases = () => {
//     return (
//         <section className="mt-16 bg-gradient-to-r from-green-50 via-primary/10 to-purple-50 p-8 rounded-xl shadow-lg">
//             <h3 className="text-3xl font-bold text-center text-primary-800 mb-8">Use Cases</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {useCasesData.map((useCase, index) => (
//                     <div key={index} className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all">
//                         <div className="flex items-center space-x-4 mb-4">
//                             {useCase.icon}
//                             <h4 className="text-xl font-semibold text-primary-700">{useCase.title}</h4>
//                         </div>
//                         <p className="text-muted-foreground">{useCase.description}</p>
//                     </div>
//                 ))}
//             </div>
//         </section>
//     )
// }

const ChatbotPage = () => {
    return (
        <section className="mt-16 bg-gradient-to-r from-green-50 via-primary/10 to-purple-50 p-8 rounded-xl shadow-lg">

            <h3 className="text-3xl font-semibold text-center mb-6 text-foreground">Use Cases</h3>
            <p className="text-base text-muted-foreground mb-6 max-w-2xl mx-auto text-center ">
                Our chatbot is designed to assist you with a variety of legal topics. Here are some of the key areas where it can help:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {useCasesData.map((useCase, index) => (
                    <div key={index} className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all">
                        <div className="flex items-center space-x-4 mb-4">
                            {useCase.icon}
                            <h4 className="text-xl font-semibold text-primary-700">{useCase.title}</h4>
                        </div>
                        <p className="text-muted-foreground">{useCase.description}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col justify-center items-center mt-4 ">
                <h3 className="text-lg font-semibold text-primary-800 mb-2">And Much More...</h3>
                <p className="text-muted-foreground text-base mb-6 max-w-5xl text-center ">
                    From legal queries to personalized assistance, our chatbot is designed to help you with a variety of topics. Whether you need help with contracts, labor rights, or other legal matters, our AI is here for you.
                </p>
                <div className='text-center' >
                    <Button size="lg">
                        Open Chatbot
                    </Button>
                    <p className="text-muted-foreground text-sm mt-2">Available 24/7 – No signup required</p>
                </div>
            </div>

            <div className="mt-20 text-center px-4 max-w-2xl mx-auto text-sm text-muted-foreground">
                This chatbot is for informational purposes only and does not constitute legal advice.
                For case-specific support, always consult a licensed lawyer.
            </div>

        </section>
    )
}

export default ChatbotPage
