import Image from 'next/image'

export default function Home() {
  return (
    <main className="max-h-screen">
      {/* Banner Principal */}
      <section className="relative h-[600px]">
        <Image
          src="/wppr-barber3.jpg"
          alt="Barbearia"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-5xl font-bold mb-4">Barber Shop</h1>
          <p className="text-xl">Estilo e precisão em cada corte</p>
          <a 
            href="/login" 
            className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors text-lg"
          >
            Agende o seu horário agora
          </a>
        </div>
      </section>

      {/* Seção de Serviços */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Serviços</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Corte de Cabelo</h3>
              <p className="text-gray-600">Cortes modernos e clássicos para todos os estilos</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Barba</h3>
              <p className="text-gray-600">Modelagem e aparação de barba com produtos premium</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Tratamentos</h3>
              <p className="text-gray-600">Hidratação, relaxamento e cuidados especiais</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Sobre */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Sobre Nossa Barbearia</h2>
              <p className="text-gray-600 mb-4">
                Com mais de 10 anos de experiência, nossa barbearia oferece serviços de alta qualidade
                em um ambiente acolhedor e profissional.
              </p>
              <p className="text-gray-600">
                Nossos barbeiros são especialistas em técnicas modernas e clássicas,
                garantindo que você saia sempre satisfeito.
              </p>
            </div>
            <div className="md:w-1/2 relative h-[400px]">
              <Image
                src="/about-barber.jpg"
                alt="Interior da Barbearia"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Contato */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Agende seu Horário</h2>
          <p className="mb-6">Entre em contato conosco ou faça seu agendamento online</p>
          <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Agendar Agora
          </button>
          <div className="mt-8">
            <p>Telefone: (11) 99999-9999</p>
            <p>Email: contato@barbershop.com</p>
            <p>Endereço: Rua da Barbearia, 123 - São Paulo, SP</p>
          </div>
        </div>
      </section>
    </main>
  )
}
