import  Feed from '@components/Feed';
const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
    <h1 className="head_text text-center ">Discover & share
    <br className="min-md:hidden"/>
    <span className="text-center orange_gradient">
      AI-Powered Prompts
    </span>
    </h1>
    <p className="desc text-center">
      promptopia is open source Ai prompting tool for modern world to discover,
      create and share creative Prompts      
    </p>
     {/* feed section */}
     <Feed />
    </section>
  )
}

export default Home