import React from 'react'
import { useState } from 'react';
import { HomePageExplore } from '../../../data/homepage-explore';
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';

const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths",
];


const ExploreMore = () => {

    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((obj) => obj.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }

    return (
        <div>
            <div className='text-4xl font-semibold text-center my-10'>
                <div>
                    Unlock the
                    <HighlightText text={" Power of Code"} />
                </div>
                <div className="text-center text-richblack-300 text-lg font-semibold mt-1">
                    Learn to Build Anything You Can Imagine
                </div>
            </div>

            {/* Tabs Section */}

            <div className="hidden lg:flex gap-5 w-max mx-auto mt-5 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] bg-richblack-800 p-1 font-medium rounded-full">
                {tabsName.map((ele, index) => (
                    <div
                        key={index}
                        className={`text-[16px] flex flex-row items-center gap-2 px-7 py-[7px]
        ${currentTab === ele
                                ? "bg-richblack-900 text-richblack-5 font-medium"
                                : "text-richblack-200"
                            }
        rounded-full cursor-pointer
        transition-colors duration-150
        hover:bg-richblack-900 hover:text-richblack-5`}
                        onClick={() => setMyCards(ele)}
                    >
                        {ele}
                    </div>
                ))}
            </div>
            <div className="hidden lg:block lg:h-[200px]"></div>

            {/* Cards section  */}

            <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full 
            lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
                {courses.map((course, index) => {
                    return (
                        <CourseCard
                            cardData={course}
                            currentCard={currentCard}
                            setCurrentCard={setCurrentCard}
                            key={index}
                        />
                    )
                })}
            </div>

        </div>
    )
}

export default ExploreMore;
