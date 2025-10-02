import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    fetchServices();
    fetchTestimonials();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/testimonials`);
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitMessage('');

    try {
      await axios.post(`${backendUrl}/api/contact`, contactForm);
      setSubmitMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      setContactForm({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
    } catch (error) {
      setSubmitMessage('Erro ao enviar mensagem. Tente novamente ou entre em contato via WhatsApp.');
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openWhatsApp = () => {
    const phoneNumber = '5567999999999'; // Replace with actual phone number
    const message = 'Olá! Gostaria de solicitar um orçamento para seus serviços.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="App">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="container mx-auto px-4 text-center relative z-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Serviços Confiáveis de Instalação & Reparo
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Sr. Sigmar – técnico de confiança para sua casa e negócio
          </p>
          <button 
            onClick={openWhatsApp}
            className="whatsapp-btn text-white px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center gap-2 shadow-lg"
          >
            <span>📱</span>
            Contato via WhatsApp
          </button>
        </div>
        
        {/* Floating WhatsApp Button */}
        <button 
          onClick={openWhatsApp}
          className="fixed-whatsapp whatsapp-btn text-white shadow-lg"
        >
          <span className="text-2xl">📱</span>
        </button>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
              Sobre o Sr. Sigmar
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3">
                <div className="w-48 h-48 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-6xl">🔧</span>
                </div>
              </div>
              <div className="md:w-2/3 text-left">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Sou o Sr. Sigmar, especializado em instalação e manutenção de eletrônicos, 
                  eletrodomésticos e sistemas de segurança. Com anos de experiência, 
                  ofereço serviços rápidos, honestos e com garantia para casas e empresas 
                  em Campo Grande e região.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>Anos de Experiência</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>Serviços Garantidos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>Atendimento Rápido</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>Preços Justos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Nossos Serviços
            </h2>
            <p className="text-xl text-gray-600">
              Oferecemos uma ampla gama de serviços especializados
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={service.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="text-4xl mb-4 text-center">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-4 text-center">
                  <button 
                    onClick={openWhatsApp}
                    className="text-primary-600 hover:text-primary-800 font-medium"
                  >
                    Solicitar Orçamento →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Por que nos escolher?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-primary-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Resposta Rápida</h3>
              <p className="text-gray-600">Atendimento ágil e pontual para suas necessidades</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-primary-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Orçamentos Gratuitos</h3>
              <p className="text-gray-600">Avaliação sem custo para todos os serviços</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-primary-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">💵</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Preços Acessíveis</h3>
              <p className="text-gray-600">Valores justos e competitivos no mercado</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-primary-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Serviço Garantido</h3>
              <p className="text-gray-600">Garantia em todos os serviços realizados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              O que nossos clientes dizem
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id || index} className="bg-gray-50 rounded-lg p-6 shadow-md">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Entre em Contato
            </h2>
            <p className="text-xl text-gray-300">
              Pronto para ajudar você com seus projetos
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">Informações de Contato</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-xl">📞</span>
                  </div>
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-gray-300">(67) 9XXXX-XXXX</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <button 
                      onClick={openWhatsApp}
                      className="text-green-400 hover:text-green-300"
                    >
                      Clique para conversar
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <p className="font-medium">Área de Atendimento</p>
                    <p className="text-gray-300">Campo Grande e região</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <button 
                  onClick={openWhatsApp}
                  className="whatsapp-btn text-white px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center gap-2 w-full justify-center lg:w-auto"
                >
                  <span>📱</span>
                  Falar no WhatsApp
                </button>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">Envie uma Mensagem</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Seu Nome"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Seu Email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Seu Telefone"
                    value={contactForm.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <select
                    name="service"
                    value={contactForm.service}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="">Selecione o Serviço</option>
                    {services.map(service => (
                      <option key={service.id} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <textarea
                    name="message"
                    placeholder="Descreva o que você precisa"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
                
                {submitMessage && (
                  <p className={`text-center ${submitMessage.includes('sucesso') ? 'text-green-400' : 'text-red-400'}`}>
                    {submitMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg">
            Sr. Sigmar – Serviços Profissionais de Instalação & Reparo
          </p>
          <p className="text-sm mt-2">
            Campo Grande e região • Atendimento de qualidade com garantia
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;