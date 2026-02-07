import React from 'react';
import Hero from '../components/Hero';
import PlatformSteps from '../components/PlatformSteps';
import FeatureSection from '../components/FeatureSection';
import PlatformIntelligence from '../components/PlatformIntelligence';
import CTASection from '../components/CTASection';

// New Models
import MarketInsights from '../components/models/MarketInsights';

const Home = () => {
    return (
        <div className="home-page">
            <main>
                <Hero />
                <PlatformSteps />

                <div style={{ margin: '6rem 0' }}>
                    <FeatureSection />
                </div>

                <div style={{ margin: '4rem 0' }}>
                    <PlatformIntelligence />
                </div>

                <div className="container" style={{ paddingBottom: '10rem' }}>
                    <MarketInsights />
                </div>

                <CTASection />
            </main>
        </div>
    );
};

export default Home;
