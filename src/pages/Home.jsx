import React from 'react';
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/Button';
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import TimelineSection from '../components/core/HomePage/TimelineSection';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import ExploreMore from '../components/core/HomePage/ExploreMore';
import Footer from '../components/common/Footer';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/operations/authAPI';


const Home = () => {

    const dispatch = useDispatch() ;
    const navigate = useNavigate() ;

    return (
        <div>
            {/* section 1  */}

            <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white'>
                <div className='group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 
                    drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none'>
                    {/* <Link to={"/signup"}>
                        <div className='flex gap-3 items-center rounded-full px-10 py-[5px] transition-all duration-200 
                        group-hover:bg-richblack-900'>
                            <p>Become an Instructor</p>
                            <FaArrowRight />
                        </div>
                    </Link> */}
                    <button onClick={() => dispatch(logout(navigate))}>
                        <div className='flex gap-3 items-center rounded-full px-10 py-[5px] transition-all duration-200 
                        group-hover:bg-richblack-900'>
                            <p>Become an Instructor</p>
                            <FaArrowRight />
                        </div>
                    </button>
                </div>
                <div className='text-center font-semibold text-4xl mt-7'>
                    Empower Your Future With
                    <HighlightText text={" Coding Skills"} />
                </div>
                <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
                    With our online coding courses, you can learn at your own pace, from anywhere in the world,
                    and get access to a wealth of resources, including hands-on projects, quizzes, and personalized
                    feedback from instructors.
                </div>
                <div className='flex gap-7 mt-8'>
                    <CTAButton active={true} linkto={"/signup"}>
                        Learn More
                    </CTAButton>
                    <CTAButton active={false} linkto={"/login"}>
                        Book a Demo
                    </CTAButton>
                </div>
                <div className='mx-3 my-10 shadow-[10px_-5px_50px_-5px] shadow-blue-200'>
                    <video
                        className="shadow-[20px_20px_rgba(255,255,255)]"
                        muted
                        autoPlay
                        loop
                        type="video/mp4"
                    // src={Banner}>
                    >
                        <source src={Banner} type="video/mp4" />
                    </video>
                </div>

                {/* Code Section 1  */}
                <div>
                    <CodeBlocks
                        position={"lg:flex-row"}
                        heading={
                            <div className="text-4xl font-semibold">
                                Unlock your
                                <HighlightText text={"coding potential"} /> with our online
                                courses.
                            </div>
                        }
                        subheading={
                            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                        }
                        ctabtn1={{
                            btnText: "Try it Yourself",
                            link: "/signup",
                            active: true,
                        }}
                        ctabtn2={{
                            btnText: "Learn More",
                            link: "/signup",
                            active: false,
                        }}
                        codeColor={"text-yellow-25"}
                        codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                        backgroundGradient={<div className="codeblock1 absolute"></div>}
                    />
                </div>

                {/* Code Section 2 */}
                <div>
                    <CodeBlocks
                        position={"lg:flex-row-reverse"}
                        heading={
                            <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                                Start
                                <HighlightText text={"coding in seconds"} />
                            </div>
                        }
                        subheading={
                            "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                        }
                        ctabtn1={{
                            btnText: "Continue Lesson",
                            link: "/signup",
                            active: true,
                        }}
                        ctabtn2={{
                            btnText: "Learn More",
                            link: "/signup",
                            active: false,
                        }}
                        codeColor={"text-white"}
                        codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                        backgroundGradient={<div className="codeblock2 absolute"></div>}
                    />
                </div>
                <ExploreMore />
            </div>

            {/* section 2  */}

            <div className='bg-pure-greys-5 text-richblue-700'>
                <div className="homepage_bg min-h-[280px] py-12 flex items-center">
                    {/* Explore Full Catalog Section */}
                    <div className="mx-auto flex w-11/12 max-w-maxContent items-center justify-center">
                        <div className="flex flex-row flex-wrap gap-5 text-white lg:pt-44 pt-24 justify-center">
                            <CTAButton active={true} linkto={"/signup"}>
                                <div className="flex items-center gap-2">
                                    Explore Full Catalog
                                    <FaArrowRight />
                                </div>
                            </CTAButton>
                            <CTAButton active={false} linkto={"/login"}>
                                Learn More
                            </CTAButton>
                        </div>
                    </div>
                </div>

                <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ">
                    <div className='flex flex-col lg:flex-row justify-between mt-10 py-6 md:py-8 lg:py-10 gap-5'>
                        <div className='text-4xl font-semibold lg:w-[45%]'>
                            Get the skills you need for a
                            <HighlightText text={" job that is in demand."} />
                        </div>
                        <div className='flex flex-col items-center lg:items-start gap-10 lg:w-[40%]'>
                            <div>The modern StudyNotion is the dictates its own terms. Today, to be a
                                competitive specialist requires more than professional skills.
                            </div>
                            <div>
                                <CTAButton active={true} linkto={"/signup"}>
                                    Learn More
                                </CTAButton>
                            </div>
                        </div>
                    </div>

                    {<TimelineSection />}

                    {<LearningLanguageSection />}

                </div>

            </div>

            {/* section 3  */}

            <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
                {/* Become a instructor section */}
                <InstructorSection />

                {/* Reviws from Other Learner */}
                <h1 className="text-center text-4xl font-semibold mt-8">
                    Reviews from other learners
                </h1>
                {/* <ReviewSlider /> */}
            </div>

            {/* section 4  */}
            <Footer />
        </div>
    )
}

export default Home;
