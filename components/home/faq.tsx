export function FAQ() {
    return (
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">What makes Fusion Generator the best?</h3>
                        <div>
                            <p className="text-gray-700">We provide deep IP customization (Dragon Ball/Pokémon) and universal AI art fusion using state-of-the-art Latent Diffusion models. Perfect for creating unique avatars, fan art concepts, or just exploring fun character mashups with high-quality results.</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Is it free to use?</h3>
                        <div>
                            <p className="text-gray-700">Yes, we offer 3 free creations daily. Upgrade to Premium for unlimited generations, Ultra HD downloads, and commercial rights.</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Do I need to sign up?</h3>
                        <div>
                            <p className="text-gray-700">You can start fusing immediately without an account. Sign up is only required to save your creations to your personal Fusion Dex/Portfolio.</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Can I use the images for commercial projects?</h3>
                        <div>
                            <p className="text-gray-700">Free tier images are for personal use only. Pro and Enterprise plans include commercial usage rights for all generated assets. Commercial usage is subject to applicable IP laws.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
