const AboutSection = () => (
    <div className="container my-5">
        <div className="row justify-content-center">
            <div className="col-lg-10">
                <h2 className="display-5 fw-bold text-dark text-center mb-4">Sobre Nosotros</h2>
                <div className="row align-items-center g-4">
                    <div className="col-md-6">
                        <h3 className="h4 fw-bold mb-3">Tradición Japonesa</h3>
                        <p className="text-muted mb-3">
                            En Sakura Sushi, nos enorgullecemos de ofrecer la más auténtica experiencia culinaria japonesa.
                            Nuestros chefs maestros preparan cada plato con ingredientes frescos y técnicas tradicionales
                            transmitidas a través de generaciones.
                        </p>
                        <p className="text-muted">
                            Desde 2010, hemos sido el destino favorito para los amantes del sushi,
                            combinando sabores tradicionales con presentaciones modernas.
                        </p>
                    </div>
                    <div className="col-md-6 text-center">
                        <div className="display-1 mb-3">🏮</div>
                        <p className="text-muted fst-italic">"El arte del sushi es el arte de la perfección"</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default AboutSection;