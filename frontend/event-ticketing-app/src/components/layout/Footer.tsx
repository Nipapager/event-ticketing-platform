const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="font-bold">EventSpot</span>
        </div>
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} EventSpot. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;