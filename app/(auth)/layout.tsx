const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className=" flex-center min-h-screen  w-full bg-primary-50
            bg-cover bg-center bg-fixed        
        bg-dotted-pattern ">
            {children}
        </div>
    )
}

export default Layout