const Header = () => {
    return (
        <header className="flex justify-between items-center p-4 bg-black text-white">
            <div className="h-6">
                <img src="Barbershop Logo 1.png" className="h-28" alt="" />
            </div>
            <nav className="flex justify-between items-center">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;