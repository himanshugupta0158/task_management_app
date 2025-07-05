import { Link } from "react-router-dom";

function LandingPage() {
    return (
        <div className="bg-gray-100 min-h-screen">
            <section className="bg-blue-600 text-white py-20 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
                        Streamline Your Workflow with Task Manager
                    </h1>
                    <p className="text-lg md:text-xl mb-8 animate-fade-in animation-delay-200">
                        Organize tasks, collaborate in real-time, and boost productivity with our intuitive task
                        management app.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            to="/register"
                            className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors animate-fade-in animation-delay-400"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/login"
                            className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors animate-fade-in animation-delay-400"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose Task Manager?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow animate-fade-in animation-delay-200">
                            <h3 className="text-xl font-semibold mb-4">Real-Time Collaboration</h3>
                            <p className="text-gray-600">
                                Stay in sync with your team with real-time task updates and notifications.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow animate-fade-in animation-delay-400">
                            <h3 className="text-xl font-semibold mb-4">Advanced Filtering</h3>
                            <p className="text-gray-600">
                                Easily find tasks by due date, priority, or assigned user with powerful filters.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow animate-fade-in animation-delay-600">
                            <h3 className="text-xl font-semibold mb-4">Role-Based Access</h3>
                            <p className="text-gray-600">
                                Manage permissions with admin and regular user roles for secure access control.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-blue-50 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Organized?</h2>
                    <p className="text-lg mb-8">
                        Join thousands of users who trust Task Manager to streamline their projects.
                    </p>
                    <Link
                        to="/register"
                        className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Sign Up Now
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;