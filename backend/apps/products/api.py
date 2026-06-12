from django.shortcuts import get_object_or_404
from ninja import Router

from .models import Product
from .schemas import ProductOut

router = Router()
miniapp_router = Router()


@router.get("/", response=list[ProductOut])
def list_products(request):
    """Public list of all active products."""
    return Product.objects.filter(is_active=True)


@router.get("/{int:product_id}/", response=ProductOut)
def get_product(request, product_id: int):
    return get_object_or_404(Product, id=product_id, is_active=True)


@miniapp_router.get("/products/", response=list[ProductOut])
def miniapp_products(request):
    """Active products consumed by the Mini App frontend."""
    return Product.objects.filter(is_active=True)
