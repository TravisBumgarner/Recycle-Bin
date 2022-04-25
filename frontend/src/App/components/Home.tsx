import React from 'react'

import { Heading, colors, } from 'sharedComponents'
import styled from 'styled-components'

import home1 from '../../static/home1.png'
import home2 from '../../static/home2.png'
import home3 from '../../static/home3.png'
import home4 from '../../static/home4.png'

const ImageWrapper = styled.div`
    border: 2px solid;
    border-radius: 1rem;
    padding: 0.5rem 1rem;
    border-color: ${colors.PRIMARY.base};
`

const Img = styled.img`
    margin-right: 1em;
    box-sizing: border-box;
    width:100%;
`

const HomeWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 2rem 0;
    justify-content: space-between;

    ${Heading.H3} {
        width: 10%;
    }

    ${ImageWrapper}{
        width: 85%;
    }
`

const content = [
    {
        text: 'Practice writing and speaking!',
        img: home1
    },
    {
        text: 'Submit Your Work for Feedback!',
        img: home2
    },
    {
        text: 'Give Others Feedback!',
        img: home3
    },
    {
        text: 'Review Your Feedback and Keep Going!',
        img: home4
    }
]

const Home = () => (
    <div>
        <Heading.H2>Welcome!</Heading.H2>
        {
            content.map(({ text, img }) => {
                return (
                    <HomeWrapper>
                        <Heading.H3>
                            {text}
                        </Heading.H3>
                        <ImageWrapper>
                            <Img src={img} />
                        </ImageWrapper>
                    </HomeWrapper>
                )
            })
        }

    </div>
)

export default Home
